# This Dockerfile is intended for development purposes and isn't required for
# using this theme.

FROM node:alpine
ENTRYPOINT sh
WORKDIR /code
RUN yarn global add tailwindcss \
  && chown node:node -R /code
COPY --chown=node:node package.json .
USER node
RUN yarn install && yarn cache clean
COPY --chown=node:node . .
