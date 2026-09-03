import sys
import subprocess
import os

GIT_PATH = r"C:\Program Files\Git\cmd\git.exe"

def run_git(args):
    cmd = [GIT_PATH if os.path.exists(GIT_PATH) else "git"] + args
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.stdout:
        print(res.stdout.strip())
    if res.stderr and res.returncode != 0:
        print("Git Error:", res.stderr.strip())
    return res.returncode

def main():
    message = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "feat: update JobShield AI codebase"
    print(f"Staging all files and committing with message: '{message}'")

    run_git(["add", "."])
    code = run_git(["commit", "-m", message])
    if code == 0 or "nothing to commit" in str(code):
        print("Pushing to GitHub (https://github.com/ivaibhavi17/JobshieldAi.git)...")
        run_git(["push", "origin", "main"])
        print("Successfully synced with GitHub!")
    else:
        print("No new changes to commit.")

if __name__ == "__main__":
    main()
