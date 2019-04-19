interface IDate {
    minDate: {year: number, month: number, day: number},
    date: string;
    time: string;
}

export default class CreateTableModel {
    public email: string = '';
    public nickname: string = '';
    public subject: string = '';
    public subjectDescription: string = '';
    public invitations: string[];
    public datetime: IDate;
    public briefMessage: string = '';

    constructor() {
        const today = new Date();

        const date = {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            day: today.getDate()
        };

        this.datetime = {
            minDate: date,
            date: '',
            time: '',
        } as IDate;
    }

    onDateSelect($event) {
        this.datetime.date = `${$event.year}-${$event.month}-${$event.day}`;
    }
}
