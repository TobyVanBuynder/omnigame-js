class User {

    constructor(config) {

        Object.assign(this, config);

        this.score = 0;
        this.lastWin = 0;
    }

    printInfo() {

        console.log(`User: ${this.name} with ID: ${this.id} has ${this.credits} credits.`);
    }

    authenticate() {
        // some code for authentication
    }

    addCredits(num) {

        this.credits += num;
    }

    getCredits() {

        const credits = this.credits;
        return credits;
    }

    addScore(num) {

        this.score += num;
        this.lastWin = num;

        console.log()
    }

    getLastWin() {

        const lastWin = this.lastWin;
        return lastWin;
    }

    printWin(score) {

        console.log(`User: ${this.name} with ID: ${this.id} has won ${score} points.`);
    }
}

exports.User = User;