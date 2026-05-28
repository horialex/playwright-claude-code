import { test } from '@playwright/test';

export class SessionUtils {
    sessionObject: Map<string, any> = new Map();
    shouldLog = process.env.LOG_TEST_DATA === 'true';

    buildObjectType(objectType: string): string {
        return objectType + '::' + test.info().testId;
    }

    putOnSession(objectType: string, object: any) {
        const key = this.buildObjectType(objectType);
        this.sessionObject.set(key, object);

        if (this.shouldLog) {
            console.log('key: ', key);
            console.log('value: ', object);
        }
    }

    getFromSession(objectType: string): any {
        return this.sessionObject.get(this.buildObjectType(objectType));
    }

    saveOnSessionList(objectType: string, object: unknown) {
        const key = this.buildObjectType(objectType);
        if (!this.sessionObject.has(key)) {
            this.sessionObject.set(key, []);
        }
        const sessionList = this.sessionObject.get(key);
        sessionList.push(object);
        this.sessionObject.set(key, sessionList);
    }

    removeFromSession(objectType: string): boolean {
        const key = this.buildObjectType(objectType);
        if (this.sessionObject.has(key)) {
            this.sessionObject.delete(key);
            return true;
        }
        return false;
    }

    hasKey(objectType: string): boolean {
        const key = this.buildObjectType(objectType);
        return this.sessionObject.has(key);
    }

    logSession() {
        console.log(JSON.stringify(Object.fromEntries(this.sessionObject)));
    }
}

let sessionInstance: SessionUtils | undefined = undefined;

export function getSessionInstance(): SessionUtils {
    if (!sessionInstance) {
        sessionInstance = new SessionUtils();
    }
    return sessionInstance;
}

export const SessionKeys = {
    BEARER: 'bearer',
};
