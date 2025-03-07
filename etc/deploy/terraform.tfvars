# Google Cloud Project Configuration
project_id = "boot41"
region     = "asia-south1"

# Container Deployment Configuration
service_name    = "designdev"
container_image = "asia-south1-docker.pkg.dev/boot41/a3/designdev"
container_tag   = "v1"

# Environment Variables (Optional)
environment_variables = {
  "DEBUG"        = "false"
  "LOG_LEVEL"    = "info"
  "DB_NAME" = "sample.sqlite3"
  "GEMINI_API_KEY"="AIzaSyD_5fblV5ao0Iu1dwnwBqgcBLYtuzA8vts"
  "MONGODB_URI"="mongodb+srv://nitin:nitin@cluster0.caa3l.mongodb.net/DesignDev"
  "JWT_SECRET"="nitin"
  "PROTECT_AI_ENDPOINTS"="false"
}
