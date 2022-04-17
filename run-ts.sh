# instance를 계속해서 1개만 활용할 것이라는 가정
# = cluster mode 필요없음
# .sh 파일로 start 해서인지, -i 1로 <instance 1개 + cluster mode(ecosystem.config.js에서 사용하던 설정)>이 실현되지 않음.
# = 현재 방법으로는 instance가 2개 이상이라 해도 cluster mode 활용불가
# 추후 cluster mode 필요 시, 다른 방안을 고려해야 함.

ts-node -T ./subscriber.ts
