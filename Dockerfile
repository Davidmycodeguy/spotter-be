FROM node:16-alpine 
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
EXPOSE 3005
RUN npx prisma generate
CMD [ "yarn","dev" ]