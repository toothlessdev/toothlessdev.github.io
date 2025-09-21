/**
 * 서버에 전체 리로드 신호를 보냅니다
 */
export function triggerFullReload(server: any) {
    server.ws.send({ type: "full-reload" });
}
