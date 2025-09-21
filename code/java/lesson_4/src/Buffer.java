import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;



class Buffer {
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition notFull = lock.newCondition();   // 缓冲区不满
    private final Condition notEmpty = lock.newCondition();  // 缓冲区不空

    private final int[] items = new int[5];
    private int count = 0; // 当前数量

    // 生产
    public void put(int item) throws InterruptedException {
        lock.lock();
        try {
            while (count == items.length) {  // 缓冲区满
                notFull.await();             // 等待 notFull 条件
            }
            items[count++] = item;
            System.out.println(Thread.currentThread().getName() + " 生产 " + item);
            notEmpty.signal();               // 唤醒等待消费的线程
        } finally {
            lock.unlock();
        }
    }

    // 消费
    public int take() throws InterruptedException {
        lock.lock();
        try {
            while (count == 0) {             // 缓冲区空
                notEmpty.await();            // 等待 notEmpty 条件
            }
            int item = items[--count];
            System.out.println(Thread.currentThread().getName() + " 消费 " + item);
            notFull.signal();                // 唤醒等待生产的线程
            return item;
        } finally {
            lock.unlock();
        }
    }
}
