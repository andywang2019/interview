

public class TicketDemo {
    public static void main(String[] args) {
        TicketSystem system = new TicketSystem();

        // 启动3个线程模拟售票窗口
        Runnable task = system::consumeTicket;
        Thread t1 = new Thread(task, "窗口1");
        Thread t2 = new Thread(task, "窗口2");
        Thread t3 = new Thread(task, "窗口3");

        t1.start();
        t2.start();
        t3.start();
    }
}
