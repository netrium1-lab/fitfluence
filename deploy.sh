#!/bin/bash

# 1. Git 변경사항 추가 및 커밋
echo "🚀 Git 변경 사항을 추가합니다..."
git add .

# 커밋 메시지가 없으면 현재 시간으로 자동 생성
msg="Update: $(date '+%Y-%m-%d %H:%M:%S')"
if [ -n "$1" ]; then
  msg="$1"
fi

git commit -m "$msg"

# 2. Git 원격 저장소(GitHub)로 푸시
echo "📤 GitHub로 코드를 전송합니다..."
git push origin main

# 3. Firebase 사이트 배포
echo "🌐 Firebase 사이트를 업데이트합니다..."
firebase deploy --project fitflunce

echo "✅ 모든 작업이 완료되었습니다!"
echo "🔗 배포된 사이트: https://fitflunce.web.app"
