import java.util.LinkedList;

class TicketPool2 {
    private final LinkedList<Integer> pool = new LinkedList<>(); // 存票的队列
    private final Object lock = new Object();
    private final int CAPACITY = 10;     // 池子最多能放10张票
    private final int MAX_TICKETS = 1000; // 总票数
    private int produced = 0;            // 已生产的数量

    // 生产票
    public void produce() {
        while (true) {
            synchronized (lock) {
                while (pool.size() == CAPACITY) { // 池子满了，等待
                    try {
                        lock.wait();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }

                if (produced >= MAX_TICKETS) {
                    // 所有票生产完毕，通知消费者退出
                    lock.notifyAll();
                    break;
                }

                produced++;
                pool.add(produced);
                System.out.println("Producer 生产了第 " + produced + " 张票，当前库存=" + pool.size());

                lock.notifyAll(); // 唤醒消费者
            }
        }
    }

    // 消费票
    public void consume() {
        while (true) {
            synchronized (lock) {
                while (pool.isEmpty()) { // 没票了，等待
                    try {
                        lock.wait();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                    if (produced >= MAX_TICKETS && pool.isEmpty()) {
                        return; // 没有票可取，退出
                    }
                }

                int ticket = pool.removeFirst();
                System.out.println(Thread.currentThread().getName() +
                        " 消费了第 " + ticket + " 张票，当前库存=" + pool.size());

                lock.notifyAll(); // 唤醒生产者
            }
        }
    }
}
