import moment from "moment"

export default function(events) {
    return events.map(event => {
        event.startDate = moment(event.startDate).format("YYYY-MM-DD HH:mm");
        event.endDate = moment(event.endDate).format("YYYY-MM-DD HH:mm");
        return event;
    });
}