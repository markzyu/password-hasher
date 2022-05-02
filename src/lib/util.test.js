import { sleep } from "./utils";

test('sleep(500)', done => {
    const before = new Date();
    sleep(500).then(() => {
        const after = new Date();
        expect(after - before).toBeGreaterThan(499);
        expect(after - before).toBeLessThan(600);
        done();
    });
});