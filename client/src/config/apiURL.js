export default function() {
    if (process.env.NODE_ENV !== "production") {
        return "http://localhost:3000"
    } else {
        return ""
    }
}