export class TestLogger {

    static log(message: string): void {
        if (process.env.LOG_TEST_DATA === 'true') {
            console.log(`[E2E LOG] ${message}`);
        }
    }

    static logUi(message: string): void {
        if (process.env.LOG_TEST_DATA === 'true') {
            console.log(`[UI LOG] ${message}`);
        }
    }

    static logEntityCreation(entityType: string, entity: object): void {
        if (process.env.LOG_TEST_DATA === 'true') {
            console.log(`[E2E API LOG] Created ${entityType}:`, entity);
        }
    }

    static logCustomMessage(message: string, data?: object): void {
        if (process.env.LOG_TEST_DATA === 'true') {
            if (data) {
                console.log(`[E2E API LOG] ${message}:`, JSON.stringify(data, null, 2));
            } else {
                console.log(`[E2E API LOG] ${message}`);
            }
        }
    }
}
