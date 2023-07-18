declare namespace NodeJS {
    interface ProcessEnv {
      readonly JWTKEY: string
      readonly DATABASE_URL: string
      readonly PORT: string
      readonly NODE_ENV:string
      readonly PLANT_KEY:string
      readonly PLANT_URL:string
    }
  }