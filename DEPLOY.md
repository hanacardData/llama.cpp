# llama.cpp Build & Deployment Guide (Ellie Custom)

This document describes how to build optimized, **standalone** executables for `ellie-server` on Windows.

## Step 0: WebUI Customization (Mandatory)

The WebUI must be built first so that its files can be embedded into the server executable.

```powershell
cd tools/server/webui
npm install
npm run build
cd ../../../
```

## Step 1: Build Optimized Standalone Servers

We build three versions of `ellie-server-*.exe` to support various hardware capabilities. By using `-DBUILD_SHARED_LIBS=OFF`, all necessary logic is bundled into a single `.exe`.

### 1. Generic (Maximum Compatibility)
```powershell
cmake -B build-generic -A x64 -DBUILD_SHARED_LIBS=OFF -DGGML_AVX512=OFF -DGGML_OPENMP=OFF
cmake --build build-generic --config Release --target llama-server
# Cleanup & Rename
Remove-Item build-generic/bin/Release/*.dll, build-generic/bin/Release/*.lib, build-generic/bin/Release/*.exp -ErrorAction SilentlyContinue
Rename-Item build-generic/bin/Release/llama-server.exe ellie-server-generic.exe
```

### 2. AVX512 Optimized
```powershell
cmake -B build-avx512 -A x64 -DBUILD_SHARED_LIBS=OFF -DGGML_AVX512=ON -DGGML_OPENMP=OFF
cmake --build build-avx512 --config Release --target llama-server
# Cleanup & Rename
Remove-Item build-avx512/bin/Release/*.dll, build-avx512/bin/Release/*.lib, build-avx512/bin/Release/*.exp -ErrorAction SilentlyContinue
Rename-Item build-avx512/bin/Release/llama-server.exe ellie-server-avx512.exe
```

### 3. AVX512 + OpenMP (Parallel Processing)
```powershell
cmake -B build-avx512-openmp -A x64 -DBUILD_SHARED_LIBS=OFF -DGGML_AVX512=ON -DGGML_OPENMP=ON
cmake --build build-avx512-openmp --config Release --target llama-server
# Cleanup & Rename
Remove-Item build-avx512-openmp/bin/Release/*.dll, build-avx512-openmp/bin/Release/*.lib, build-avx512-openmp/bin/Release/*.exp -ErrorAction SilentlyContinue
Rename-Item build-avx512-openmp/bin/Release/llama-server.exe ellie-server-avx512-openmp.exe
```

## Final Deliverables

After build and cleanup, the standalone executables will be located at:
- `build-generic/bin/Release/ellie-server-generic.exe`
- `build-avx512/bin/Release/ellie-server-avx512.exe`
- `build-avx512-openmp/bin/Release/ellie-server-avx512-openmp.exe`
