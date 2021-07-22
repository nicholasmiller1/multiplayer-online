class ConnectionManager {
    constructor(gameManager, socket) {
        this.socket = socket;
        
        this.gameManager = gameManager;
        this.localGame = this.gameManager.instances[0];
    }

    connect(roomId) {
        this.socket.emit('join room', {})
    }
}