public class TicketPoolDemo {
    public static void main(String[] args) {
        TicketPool pool = new TicketPool();

        // Producer线程
        Thread producer = new Thread(pool::produce, "Producer");

        // 3个消费者线程
        Thread c1 = new Thread(pool::consume, "Consumer-1");
        Thread c2 = new Thread(pool::consume, "Consumer-2");
        Thread c3 = new Thread(pool::consume, "Consumer-3");

        producer.start();
        c1.start();
        c2.start();
        c3.start();
    }
}