import java.util.*;
import java.util.stream.*;

public class StreamDemo {
    public static void main(String[] args) {
        List<String> fruits = Arrays.asList("apple", "banana", "orange", "kiwi", "mango");
//example1
        //case1
        fruits.stream()
            .filter(f -> f.length() > 5)   // 过滤
            .map(String::toUpperCase)      // 转大写
            .sorted()                      // 排序
            .collect(Collectors.toList()).forEach(System.out::print);

    //case 2
        Map<String, Integer> map = fruits.stream()
                .collect(Collectors.toMap(f -> f, String::length, (a, b) -> a));
        System.out.println(map); // {apple=5, banana=6}

    //case 3
        long count = fruits.stream().collect(Collectors.counting());
        System.out.println(count); // 3
    //case 4
        IntSummaryStatistics stats = fruits.stream()
                .collect(Collectors.summarizingInt(String::length));
        System.out.println(stats.getAverage()); // 平均长度
        System.out.println(stats.getMax());     // 最长
        System.out.println(stats.getMin());     // 最短
        System.out.println(stats.getSum());     // 总和
        //case 5
        Map<Integer, List<String>> grouped = fruits.stream()
                .collect(Collectors.groupingBy(String::length));
        System.out.println(grouped);
// {5=[apple], 6=[banana, orange]}
        //case 6
        Map<Integer, Map<Character, List<String>>> multiGrouped =
                fruits.stream().collect(Collectors.groupingBy(
                        String::length,
                        Collectors.groupingBy(s -> s.charAt(0))
                ));

        System.out.println(multiGrouped);
// {5={a=[apple]}, 6={b=[banana], o=[orange]}}




//example2
        List<Employee> employees = Arrays.asList(
                new Employee("Alice", "IT", 8000),
                new Employee("Bob", "IT", 12000),
                new Employee("Charlie", "IT", 15000),
                new Employee("David", "HR", 9000),
                new Employee("Eva", "HR", 11000)
        );


        //case 7
        Map<String, Double> avgSalaryByDept = employees.stream()
                .collect(Collectors.groupingBy(Employee::getGroup,
                        Collectors.averagingInt(Employee::getSalary)));

        System.out.println(avgSalaryByDept);
// {HR=10000.0, IT=11666.6...}

        //case 8
        Optional<Employee> secondHighest = employees.stream()
                .filter(e -> e.getGroup().equals("IT"))        // 只看 IT 组
                .sorted(Comparator.comparingInt(Employee::getSalary).reversed()) // 按工资降序
                .skip(1)   // 跳过第一高
                .findFirst(); // 取下一个

        secondHighest.ifPresent(System.out::println);
        // 每个部门的第二高工资员工
        Map<String, Optional<Employee>> secondHighestByDept =
                employees.stream()
                        .collect(Collectors.groupingBy(
                                Employee::getGroup,
                                Collectors.collectingAndThen(
                                        Collectors.toList(),
                                        list -> list.stream()
                                                .sorted(Comparator.comparingInt(Employee::getSalary).reversed())
                                                .skip(1) // 跳过最高的
                                                .findFirst()
                                )
                        )
                        );


   //     secondHighestByDept.ifPresent(System.out::println);

        secondHighestByDept.forEach((dept, emp) ->
                System.out.println(dept + " -> " + emp.orElse(null))
        );
    }





}
