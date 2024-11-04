export interface NotificationType {
    id : number
    status?: "DEVICE_CREATED" | 'DEVICE_CONNECTED' | 'DEVICE_DISCONNECTED' |
     'DEVICE_DELETED' | 'DEVICE_UPDATED' | 'DEVICE_NOT_FOUND' | 'DEVICE_ALREADY_EXISTS' | 'DEVICE_NOT_CONNECTED'
    message?: string
    deviceName?: string
    deviceId?: number
    read?: boolean
    timestamp?:  Date
}