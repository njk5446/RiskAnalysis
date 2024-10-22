from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
import torch.nn as nn
import joblib
import numpy as np
from collections import defaultdict, deque
import logging
from datetime import datetime
import os
from fastapi.middleware.cors import CORSMiddleware

# FastAPI 애플리케이션 생성
app = FastAPI()

# CORS 설정 (프론트엔드 도메인에 맞게 수정)
origins = [
    "http://localhost:3000",  # React 개발 서버
    "http://localhost:8080",  # 스프링부트 개발 서버
    # 배포 시 프론트엔드 도메인 추가
    "http://192.168.0.131:8080",
    "http://192.168.0.143:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 모델 및 스케일러 경로 설정
CNN_LSTM_MODEL_PATH = 'model/CNNLSTM_best_model.pth'
AUTOENCODER_MODEL_PATH = 'model/autoencoder.pth'
CNN_LSTM_SCALER_PATH = 'model/cnn_lstm_scaler.pkl'
AUTOENCODER_SCALER_PATH = 'model/autoencoder_scaler.pkl'

# 슬라이딩 윈도우 크기 및 스텝 설정
WINDOW_SIZE = 128
STEP_SIZE = 64

# CNN-LSTM 예측 및 Autoencoder 이상 탐지용 버퍼 설정
gyro_buffers = defaultdict(lambda: deque(maxlen=WINDOW_SIZE))
combined_buffers = defaultdict(lambda: deque(maxlen=WINDOW_SIZE))  # Autoencoder를 위한 버퍼 (생체 신호와 자이로스코프 신호 모두 포함)

# 위험 평가 기준 설정
def evaluate_risk(Activity, Heartbeat, Temperature, OutsideTemperature):
    # 초기 risk_flag 설정
    risk_flag = 0
    
    # 1. 걷기 : 평상 심박수 60 - 120 bpm
    if Activity == 'Walking':
        if 60 <= Heartbeat < 120 and 36 <= Temperature < 37.5:
            risk_flag = 0  # 정상 상태
        elif (Heartbeat < 50 or Heartbeat >= 130) and (Temperature < 35 or Temperature >= 37.5):
            risk_flag = 2  # 위험 상태
        elif (Heartbeat < 60 or Heartbeat >= 120) and (Temperature < 36 or Temperature >= 37.5):
            if OutsideTemperature < 10 or OutsideTemperature >= 30:
                risk_flag = 2  # 주의 상태, 외부 온도 조건에 따라 위험 분류
            else:
                risk_flag = 1  # 주의 상태
        else:
            risk_flag = 0  # 이외 케이스 정상 상태 분류

    # 2. 서기 : 평상 심박수 60 - 100 bpm
    elif Activity == 'Standing':
        if 60 <= Heartbeat < 100 and 36 <= Temperature < 37.5:
            risk_flag = 0  # 정상 상태
        elif (Heartbeat < 50 or Heartbeat >= 110) and (Temperature < 35 or Temperature >= 37.5):
            risk_flag = 2  # 위험 상태
        elif (Heartbeat < 60 or Heartbeat >= 100) and (Temperature < 36 or Temperature >= 37.5):
            if OutsideTemperature < 10 or OutsideTemperature >= 30:
                risk_flag = 2  # 주의 상태, 외부 온도 조건에 따라 위험 분류
            else:
                risk_flag = 1  # 주의 상태
        else:
            risk_flag = 0  # 이외 케이스 정상 상태 분류

    # 3. 앉음 : 평상 심박수 60 - 100 bpm
    elif Activity == 'Sitting':
        if 60 <= Heartbeat < 100 and 36 <= Temperature < 37.5:
            risk_flag = 0  # 정상 상태
        elif (Heartbeat < 50 or Heartbeat >= 110) and (Temperature < 35 or Temperature >= 37.5):
            risk_flag = 2  # 위험 상태
        elif (Heartbeat < 60 or Heartbeat >= 100) and (Temperature < 36 or Temperature >= 37.5):
            if OutsideTemperature < 10 or OutsideTemperature >= 30:
                risk_flag = 2  # 주의 상태, 외부 온도 조건에 따라 위험 분류
            else:
                risk_flag = 1  # 주의 상태
        else:
            risk_flag = 0  # 이외 케이스 정상 상태 분류

    # 4. 누움 : 평상 심박수 50 - 100 bpm
    elif Activity == 'Laying':
        if 50 <= Heartbeat < 100 and 36 <= Temperature < 37.5:
            risk_flag = 0  # 정상 상태
        elif (Heartbeat < 40 or Heartbeat >= 110) and (Temperature < 35 or Temperature >= 37.5):
            risk_flag = 2  # 위험 상태
        elif (Heartbeat < 50 or Heartbeat >= 100) and (Temperature < 36 or Temperature >= 37.5):
            if OutsideTemperature < 10 or OutsideTemperature >= 30:
                risk_flag = 2  # 주의 상태, 외부 온도 조건에 따라 위험 분류
            else:
                risk_flag = 1  # 주의 상태
        else:
            risk_flag = 0  # 이외 케이스 정상 상태 분류

    # 5. 계단 내려감 : 평상 심박수 70 - 130 bpm
    elif Activity == 'Walking Downstairs':
        if 70 <= Heartbeat < 130 and 36 <= Temperature < 37.5:
            risk_flag = 0  # 정상 상태
        elif (Heartbeat < 60 or Heartbeat >= 140) and (Temperature < 35 or Temperature >= 37.5):
            risk_flag = 2  # 위험 상태
        elif (Heartbeat < 70 or Heartbeat >= 130) and (Temperature < 36 or Temperature >= 37.5):
            if OutsideTemperature < 10 or OutsideTemperature >= 30:
                risk_flag = 2  # 주의 상태, 외부 온도 조건에 따라 위험 분류
            else:
                risk_flag = 1  # 주의 상태
        else:
            risk_flag = 0  # 이외 케이스 정상 상태 분류

    # 6. 계단 올라감 : 평상 심박수 80 - 140 bpm
    elif Activity == 'Walking Upstairs':
        if 80 <= Heartbeat < 140 and 36 <= Temperature < 37.5:
            risk_flag = 0  # 정상 상태
        elif (Heartbeat < 70 or Heartbeat >= 150) and (Temperature < 35 or Temperature >= 37.5):
            risk_flag = 2  # 위험 상태
        elif (Heartbeat < 80 or Heartbeat >= 140) and (Temperature < 36 or Temperature >= 37.5):
            if OutsideTemperature < 10 or OutsideTemperature >= 30:
                risk_flag = 2  # 주의 상태, 외부 온도 조건에 따라 위험 분류
            else:
                risk_flag = 1  # 주의 상태
        else:
            risk_flag = 0  # 이외 케이스 정상 상태 분류

    # 최종 risk_flag 반환
    return risk_flag


# CNN-LSTM 모델 정의
class CNNLSTMModel(nn.Module):
    def __init__(self, input_channels, hidden_size, num_layers, num_classes, dropout):
        super(CNNLSTMModel, self).__init__()
        self.conv1 = nn.Conv1d(in_channels=input_channels, out_channels=64, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm1d(64)
        self.conv2 = nn.Conv1d(in_channels=64, out_channels=128, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm1d(128)
        self.dropout = nn.Dropout(dropout)
        self.lstm = nn.LSTM(
            input_size=128,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0
        )
        self.fc = nn.Linear(hidden_size, num_classes)

    def forward(self, x):
        x = torch.relu(self.bn1(self.conv1(x)))
        x = torch.relu(self.bn2(self.conv2(x)))
        x = self.dropout(x)
        x = x.permute(0, 2, 1)
        out, _ = self.lstm(x)
        out = self.fc(out[:, -1, :])
        return out

# Autoencoder 모델 정의
class Autoencoder(nn.Module):
    def __init__(self, input_dim, hidden_dim):
        super(Autoencoder, self).__init__()
        # 인코더
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.ReLU()
        )
        # 디코더
        self.decoder = nn.Sequential(
            nn.Linear(hidden_dim // 2, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, input_dim),
            nn.ReLU()
        )
    
    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded
    
# 모델 및 스케일러 로드 (싱글톤 패턴 적용)
class ModelLoader:
    cnn_lstm_model = None
    autoencoder_model = None
    cnn_lstm_scaler = None
    autoencoder_scaler = None
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    @classmethod
    def load_cnn_lstm_model(cls):
        if cls.cnn_lstm_model is None:
            cls.cnn_lstm_model = CNNLSTMModel(
                input_channels=3,
                hidden_size=128,
                num_layers=3,
                num_classes=6,
                dropout=0.3
            )
            checkpoint = torch.load(CNN_LSTM_MODEL_PATH, map_location=cls.device)
            cls.cnn_lstm_model.load_state_dict(checkpoint['model_state_dict'], strict=True)
            cls.cnn_lstm_model.to(cls.device)
            cls.cnn_lstm_model.eval()
        return cls.cnn_lstm_model

    @classmethod
    def load_autoencoder_model(cls):
        if cls.autoencoder_model is None:
            cls.autoencoder_model = Autoencoder(input_dim=8, hidden_dim=32)
            cls.autoencoder_model.load_state_dict(torch.load(AUTOENCODER_MODEL_PATH, map_location=cls.device))
            cls.autoencoder_model.to(cls.device)
            cls.autoencoder_model.eval()
        return cls.autoencoder_model

    @classmethod
    def load_cnn_lstm_scaler(cls):
        if cls.cnn_lstm_scaler is None:
            cls.cnn_lstm_scaler = joblib.load(CNN_LSTM_SCALER_PATH)
        return cls.cnn_lstm_scaler

    @classmethod
    def load_autoencoder_scaler(cls):
        if cls.autoencoder_scaler is None:
            cls.autoencoder_scaler = joblib.load(AUTOENCODER_SCALER_PATH)
        return cls.autoencoder_scaler
    
# 요청 데이터 모델 정의
class PredictRequest(BaseModel):
    userCode: str
    workDate: str
    vitalDate: str
    gyroData: list
    heartbeat: float
    temperature: float
    outsideTemperature: float
    latitude: float
    longitude: float

# 자이로스코프 데이터 예측 및 위험 평가 함수 (Autoencoder 추가)
def predict_activity_and_evaluate_risk(user_code, work_date):
    key = (work_date, user_code)

    # 슬라이딩 윈도우 크기만큼 데이터가 준비되었는지 확인
    if len(gyro_buffers[key]) < WINDOW_SIZE or len(combined_buffers[key]) < WINDOW_SIZE:
        raise ValueError("슬라이딩 윈도우 적용 후 사용할 수 있는 데이터가 없습니다.")

    # CNN-LSTM을 사용한 활동 예측
    windows = np.array(gyro_buffers[key]).astype(np.float32)
    windows = np.expand_dims(windows, axis=0)  # 배치 차원 추가
    samples, time_steps, features = windows.shape

    # 데이터 스케일링
    cnn_lstm_scaler = ModelLoader.load_cnn_lstm_scaler()
    windows_reshaped = windows.reshape(-1, features)
    windows_scaled = cnn_lstm_scaler.transform(windows_reshaped).reshape(samples, time_steps, features)

    # 모델 예측
    device = ModelLoader.device
    cnn_lstm_model = ModelLoader.load_cnn_lstm_model()
    tensor_X = torch.tensor(windows_scaled, dtype=torch.float32).to(device)
    tensor_X = tensor_X.permute(0, 2, 1)

    with torch.no_grad():
        outputs = cnn_lstm_model(tensor_X)
        _, predicted = torch.max(outputs.data, 1)

    # 활동 매핑
    activity_mapping = {
        0: 'Walking',
        1: 'Walking Upstairs',
        2: 'Walking Downstairs',
        3: 'Sitting',
        4: 'Standing',
        5: 'Laying'
    }
    activity = activity_mapping.get(predicted.item(), 'Unknown')

    # Autoencoder를 통한 이상 탐지
    autoencoder = ModelLoader.load_autoencoder_model()
    autoencoder_scaler = ModelLoader.load_autoencoder_scaler()
    current_vital_data = np.array(combined_buffers[key]).astype(np.float32)
    current_vital_data_scaled = autoencoder_scaler.transform(current_vital_data)  # 스케일링

    input_tensor = torch.tensor(current_vital_data_scaled, dtype=torch.float32).to(device)
    with torch.no_grad():
        reconstructed = autoencoder(input_tensor)
        reconstruction_error = torch.mean((input_tensor - reconstructed) ** 2, dim=1).cpu().numpy()

    # 재구성 오류가 임계값을 넘는지 확인
    threshold = 1.689565  # 이전에 설정한 임계값
    is_anomalous = np.any(reconstruction_error > threshold)

    # 위험 플래그 설정 (조건판별문 + 이상 탐지 결과 결합)
    heart_rate, temperature, outside_temp = combined_buffers[key][-1][:3]
    risk_flag = evaluate_risk(activity, heart_rate, temperature, outside_temp)

    if is_anomalous:
        risk_flag = max(risk_flag, 1)  # 기존 위험 플래그보다 이상 탐지 결과가 더 높다면 업데이트

    return activity, risk_flag

# 비동기 엔드포인트 정의 (Spring Boot에서 오는 데이터 처리)
@app.post("/api/data/")
async def receive_data(request: PredictRequest):
    try:
        logger.info(f"Received data: {request.json()}")

        user_code = request.userCode
        work_date = request.workDate
        vital_date = request.vitalDate
        heart_rate = request.heartbeat
        temperature = request.temperature
        outside_temp = request.outsideTemperature
        latitude = request.latitude
        longitude = request.longitude
        gyro_data = request.gyroData  # [X, Y, Z]

        key = (work_date, user_code)

        # CNN-LSTM 모델을 위한 자이로스코프 데이터만 버퍼에 추가
        gyro_buffers[key].append(gyro_data)

        # Autoencoder를 위한 전체 특성 데이터 버퍼에 추가
        combined_data = [
            heart_rate, temperature, outside_temp, latitude, longitude,
            gyro_data[0], gyro_data[1], gyro_data[2]
        ]
        combined_buffers[key].append(combined_data)

        logger.info(f"Buffer size for user {user_code} on {work_date}: {len(gyro_buffers[key])}")

        response = {}
        if len(gyro_buffers[key]) == WINDOW_SIZE and len(combined_buffers[key]) == WINDOW_SIZE:
            # CNN-LSTM 예측 및 Autoencoder 이상 탐지
            activity, risk_flag = predict_activity_and_evaluate_risk(user_code, work_date)

            # 응답 데이터 구성
            response = {
                'userCode': user_code,
                'workDate': work_date,
                'vitalDate': vital_date,
                'heartbeat': heart_rate,
                'temperature': temperature,
                'outsideTemperature': outside_temp,
                'latitude': latitude,
                'longitude': longitude,
                'activity': activity,
                'riskFlag': risk_flag,
            }
            logger.info(f"Processed data for user {user_code} on {work_date}: {response}")

            # 버퍼 재설정
            gyro_buffers[key].clear()
            combined_buffers[key].clear()

        else:
            response = {'message': '데이터 버퍼링 중입니다. 충분한 데이터가 쌓일 때까지 기다려주세요.'}

        return response

    except ValueError as ve:
        logger.error(f"ValueError: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Unhandled Exception: {str(e)}")
        raise HTTPException(status_code=500, detail='Internal Server Error')

# FastAPI 서버 실행
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)