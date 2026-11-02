@echo off
chcp 65001 >nul
title 作品集本地服务
cd /d "%~dp0"

set "NODE_EXE=D:\Program Files\Tools\Nvm\nodejs\node.exe"
if not exist "%NODE_EXE%" set "NODE_EXE=node"

echo.
echo   正在启动作品集服务...
echo.

"%NODE_EXE%" server.js %*

echo.
echo   服务已停止，按任意键关闭窗口。
pause >nul
