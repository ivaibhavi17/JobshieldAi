import os
import sys
import subprocess
import uvicorn

def main():
    print("=" * 60)
    print("🚀 JobShield AI Production Server Launcher")
    print("=" * 60)

    project_root = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(project_root, "frontend")
    dist_dir = os.path.join(frontend_dir, "dist")

    # Step 1: Verify / build production frontend assets
    if not os.path.exists(dist_dir):
        print("📦 Building production frontend assets...")
        res = subprocess.run(["npm", "run", "build"], cwd=frontend_dir, shell=True)
        if res.returncode != 0:
            print("❌ Frontend build failed!")
            sys.exit(1)
        print("✅ Frontend build completed successfully!")
    else:
        print("✅ Production frontend assets detected at frontend/dist!")

    # Step 2: Start unified Uvicorn FastAPI production server
    backend_dir = os.path.join(project_root, "backend")
    sys.path.insert(0, backend_dir)

    print("⚡ Starting JobShield AI unified production server on http://localhost:8000 ...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False, app_dir=backend_dir)

if __name__ == "__main__":
    main()
