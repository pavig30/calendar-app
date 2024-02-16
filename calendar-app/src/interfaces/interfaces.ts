export interface Event {
    id: string;
    launchDate: string;
    title: string;
    summary: string;
    imageFilenameThumb: string;
    imageFilenameFull: string;
    learnMoreLink: string;
    purchaseLink: string;
}

export interface DaysProps {
    currentMonth: Date,
    events: Array<any>,
}