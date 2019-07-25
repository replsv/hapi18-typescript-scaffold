FROM node:12

ENV APP_DIR /var/www/app/

RUN mkdir -p $APP_DIR
ADD ./src $APP_DIR
ADD ./logs $APP_DIR
ADD ./package.json $APP_DIR/package.json
ADD ./tsconfig.json $APP_DIR/tsconfig.json

WORKDIR $APP_DIR

EXPOSE $HTTP_PORT

RUN rm -rf ${APP_DIR}/node_modules
RUN npm install