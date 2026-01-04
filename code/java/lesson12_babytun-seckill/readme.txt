 ┌───────────────┐
                   │   Nginx / LB  │
                   └───────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                           │
      ┌───────▼───────┐           ┌──────▼────────┐
      │ SpringBoot    │           │ SpringBoot     │
      │ JVM (8001)    │           │ JVM (8002)     │
      │               │           │                │
      │ SecKillCtrl A │           │ SecKillCtrl B  │
      │   (单例)      │           │   (单例)       │
      │               │           │                │
      │ Tomcat        │           │ Tomcat         │
      │  exec-1       │           │  exec-1        │
      │  exec-2       │           │  exec-2        │
      │  exec-3       │           │  exec-3        │
      └───────────────┘           └────────────────┘