package com.example.transaction;

import java.sql.Connection;
import java.sql.SQLException;

public class TransactionManager {
    private static ThreadLocal<Connection> connectionHolder = new ThreadLocal<>();
    
    public static void beginTransaction(Connection connection) throws SQLException {
        connection.setAutoCommit(false);
        connectionHolder.set(connection);
        System.out.println("    [事务管理器] 开启事务");
    }
    
    public static void commit() throws SQLException {
        Connection connection = connectionHolder.get();
        if (connection != null) {
            connection.commit();
            System.out.println("    [事务管理器] 提交事务");
        }
    }
    
    public static void rollback() {
        Connection connection = connectionHolder.get();
        if (connection != null) {
            try {
                connection.rollback();
                System.out.println("    [事务管理器] 回滚事务");
            } catch (SQLException e) {
                System.err.println("    [事务管理器] 回滚失败: " + e.getMessage());
            }
        }
    }
    
    public static void close() {
        Connection connection = connectionHolder.get();
        if (connection != null) {
            try {
                connection.setAutoCommit(true);
                connection.close();
                connectionHolder.remove();
                System.out.println("    [事务管理器] 关闭连接");
            } catch (SQLException e) {
                System.err.println("    [事务管理器] 关闭连接失败: " + e.getMessage());
            }
        }
    }
    
    public static Connection getConnection() {
        return connectionHolder.get();
    }
}
