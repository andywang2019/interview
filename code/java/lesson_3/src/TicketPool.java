class TicketPool {
    private int ticketId = 0;   // 每张票的编号
    private boolean hasTicket = false; // 是否有票
    private final Object lock = new Object();
    private final int MAX_TICKETS = 1000; // 总票数
    private int produced = 0;   // 已经生产的票数

    // 生产票
    public void produce() {
        while (true) {
            synchronized (lock) {
                while (hasTicket) { // 如果票池满了，等待消费者取走
                    try {
                        lock.wait();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }

                if (produced >= MAX_TICKETS) {
                    // 所有票生产完毕，通知消费者停止
                    lock.notifyAll();
                    break;
                }

                ticketId = ++produced;
                hasTicket = true;
                System.out.println("Producer 生产了第 " + ticketId + " 张票");

                lock.notifyAll(); // 唤醒消费者
            }
        }
    }

    // 消费票
    public void consume() {
        while (true) {
            synchronized (lock) {
                while (!hasTicket) { // 如果没有票，等待生产者生产
                    try {
                        lock.wait();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                    if (produced >= MAX_TICKETS) return; // 退出条件
                }

                System.out.println(Thread.currentThread().getName() +
                        " 消费了第 " + ticketId + " 张票");
                hasTicket = false;

                lock.notifyAll(); // 唤醒生产者继续生产
            }
        }
    }
}
