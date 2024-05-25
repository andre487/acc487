// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Code(data: any) {
    return (
        <pre className="code">{JSON.stringify(data, null, 2)}</pre>
    );
}
