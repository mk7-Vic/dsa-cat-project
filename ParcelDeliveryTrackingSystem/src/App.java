import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

public class App {
    public static void main(String[] args) {
        System.out.println("====================================");
        System.out.println("🚀 JAVA PROJECT VERIFICATION SUCCESS");
        System.out.println("====================================");
        
        // 1. Test Time/Date Library
        System.out.println("Current Time: " + LocalDateTime.now());
        
        // 2. Test Stream API & Lambda Expressions
        List<String> checks = Arrays.asList("Compiler", "Runtime", "Extensions", "Terminal");
        System.out.print("Verifying components: ");
        checks.stream().forEach(component -> System.out.print("[" + component + "] "));
        System.out.println("\n====================================");
    }
}
