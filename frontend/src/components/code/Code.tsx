export default function Code(data: any) {
    return (
        <pre className="code">{JSON.stringify(data, null, 2)}</pre>
    );
}
