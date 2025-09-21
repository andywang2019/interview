class Employee {
    private String name;
    private String group;
    private int salary;

    public Employee(String name, String group, int salary) {
        this.name = name;
        this.group = group;
        this.salary = salary;
    }
    public String getName() { return name; }
    public String getGroup() { return group; }
    public int getSalary() { return salary; }

    @Override
    public String toString() {
        return name + " (" + group + ") - " + salary;
    }
}