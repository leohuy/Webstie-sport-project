# Sử dụng môi trường Node.js
FROM node:18-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file cấu hình thư viện và cài đặt
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn backend vào container
COPY . .

# Mở cổng 8080 (cổng API của bạn)
EXPOSE 8080

# Câu lệnh chạy server
CMD ["node", "src/server.js"]
