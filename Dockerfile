FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Skip husky's prepare hook inside the image build (no .git in the build context).
RUN npm ci --ignore-scripts

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
# --chown so the non-root user owns the runtime files; pre-create the writable
# cache dir it needs the moment anything uses next/image, ISR, or revalidation.
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
