
export interface Timer {
    currentTime: Date;
    setTimeH: number;
    setTimeM: number;
    setTimeS: number;
    onTime: boolean;
};

function padding(nb: number): string {
    return String(nb).padStart(2, '0');
}

export class timeSpan implements Timer {
    currentTime: Date;
    setTimeH: number;
    setTimeM: number;
    setTimeS: number;
    onTime: boolean;
    private displayElement: HTMLElement | null;

    private intervalValid: NodeJS.Timeout | null = null;
    constructor(setTimeH: number, setTimeM: number,
        setTimeS: number, elementId: string
    ) {
        this.currentTime = new Date();
        this.setTimeH = setTimeH;
        this.setTimeM = setTimeM;
        this.setTimeS = setTimeS;
        this.displayElement = document.getElementById(elementId);
        this.onTime = false;
    }
    private tick(): void {
        this.currentTime = new Date();
        if (this.setTimeS > 0) {
            this.setTimeS--;
        } else if (this.setTimeM > 0) {
            this.setTimeM--;
            this.setTimeS = 59;
        } else if (this.setTimeH > 0) {
            this.setTimeH--;
            this.setTimeM = 59;
            this.setTimeS = 59;
        } else {
            this.stop();

        }
        this.display();

    };

    startTime(): void {
        if (this.onTime) return;
        this.onTime = true;
        this.intervalValid = setInterval(() => {
            this.tick();
        }, 1000);
    }

    stop(): void {
        if (this.intervalValid) {
            clearInterval(this.intervalValid);
            this.intervalValid = null;
        }
        this.onTime = false;

    }

    display(): void {
        // format 0M:0S:0H
        const target = `${padding(this.setTimeH)}:${padding(this.setTimeM)}:${padding(this.setTimeS)}`;
        if (this.displayElement) {
            this.displayElement.textContent = target;
        }
        console.clear();
        console.log(`Remaining: ${padding(this.setTimeH)}:${padding(this.setTimeM)}:${padding(this.setTimeS)}`);

    }

    isActiveTimer(): boolean {
        return this.onTime;
    }


}


