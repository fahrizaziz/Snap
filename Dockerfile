# Gunakan image Node.js sebagai base image
FROM node:18-alpine 

# Buat direktori kerja dalam container
WORKDIR /app

# Salin package.json dan yarn.lock ke direktori kerja
COPY package.json yarn.lock /app/

# Install dependencies menggunakan Yarn
RUN yarn config set "strict-ssl" false -g 

RUN yarn install

# Salin semua file proyek ke direktori kerja
COPY . /app/

RUN yarn build

# Expose port yang digunakan oleh aplikasi
EXPOSE 10076

ENV TZ=Asia/Jakarta

# Jalankan aplikasi
CMD ["yarn", "start:prod"]