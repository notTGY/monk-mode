package main

import (
  "net/http"
  "log"
  "fmt"
  "strconv"
  "os"
  "embed"
  "io/fs"

  "github.com/joho/godotenv"
)

func init() {
	if err := godotenv.Load(); err != nil { /* No .env file */
	}
}

func LoadPort() int {
	defaultPort := 3000
	portStr, exists := os.LookupEnv("PORT")
	if !exists {
		return defaultPort
	}
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return defaultPort
	}
	return port
}

//go:embed image-converter/dist
var staticFiles embed.FS

func main() {
  log.SetFlags(log.LstdFlags | log.Lshortfile)
  port := LoadPort()

	staticFS := fs.FS(staticFiles)
	staticContent, err := fs.Sub(staticFS, "image-converter/dist")
	if err != nil {
		log.Fatal(err)
	}
	fileServer := http.FileServer(http.FS(staticContent))

  http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    fileServer.ServeHTTP(w, r)
  })

  http.HandleFunc("/api/email", func (w http.ResponseWriter, r *http.Request) {
    hasEmail := r.URL.Query().Has("v")
    if hasEmail {
      email := r.URL.Query().Get("v")
      fmt.Printf("\"%s\",\n", email)
    }
  })

  err = http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
  if err != nil {
    log.Println(err)
  }
}
