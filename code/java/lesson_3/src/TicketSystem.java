class TicketSystem {
    private int tickets = 1000;
    private final Object lock = new Object();

    public void consumeTicket() {
        while (true) {
            synchronized (lock) {
                // 没票了，直接退出循环
                if (tickets <= 0) {
                    System.out.println(Thread.currentThread().getName() + " 发现票已售罄，停止售票");
                    break;
                }

                // 卖出一张票
                System.out.println(Thread.currentThread().getName() + " 卖出第 " + tickets + " 张票");
                tickets--;

                // 唤醒其他可能在等待的线程
                lock.notifyAll();

                try {
                    // 主动让出锁，模拟下一次抢票
                    lock.wait(10);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }
}