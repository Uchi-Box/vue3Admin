#前端镜像
FROM node:12.10.0-alpine as client
#在容器中创建文件夹
RUN mkdir /opt/vue3admin
#切换工作文件夹
WORKDIR /opt/vue3admin
#拷贝npm包信息至容器
COPY ./package.json /opt/vue3admin
#指定代理地址并安装依赖
RUN npm install --registry=https://registry.npm.taobao.org
# 拷贝其他所有文件到容器（除了 .dockerignore 中的目录和文件）
COPY . /opt/vue3admin
#构建app
RUN npm run build:release

#nginx镜像
FROM nginx:1.16.0-alpine
#将build目录交给nginx容器
COPY --from=client /opt/vue3admin/dist /usr/share/nginx/html
#清除nginx默认配置
RUN rm /etc/nginx/conf.d/default.conf
#复制nginx配置
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000