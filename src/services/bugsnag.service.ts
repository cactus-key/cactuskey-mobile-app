import Bugsnag from '@bugsnag/expo';

export class BugsnagService {

    // Singleton
    private static bugsnag_instance: any = null;
    static getInstance(): any {
        if (BugsnagService.bugsnag_instance === null)
        BugsnagService.bugsnag_instance = Bugsnag();
        return BugsnagService.bugsnag_instance;
    }

    /**
     * Get bugsnag error boundary
     */
    static errorBoundary() {
        return BugsnagService.getInstance().getPlugin('react');
    }

    /**
     * Log bugsnag breadcrumb
     * @param data 
     */
    static leaveBreadcrumb(data: string, meta: any): void {
        BugsnagService.getInstance().leaveBreadcrumb(data, meta);
    }

    /**
     * Generate breadcrum logger for scene
     * @param data 
     */
    static sceneBreadcrumbLogger(scene_name: string): (data: string) => void {
        const logger = (data: string) => {
            BugsnagService.leaveBreadcrumb(data, {scene: scene_name});
        };

        logger('Launched');
        return logger;
    }

    /**
     * Notify new error
     * @param data 
     */
    static notify(error: Error): void {
        BugsnagService.getInstance().notify(error);
    }

}
