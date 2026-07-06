package parceltracking;

import manager.ParcelManager;
import model.Parcel;

// Added built-in Java server imports
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) {
        // Create Parcel Manager
        ParcelManager manager = new ParcelManager();
        System.out.println("==========================================");
        System.out.println("       PARCEL DELIVERY TRACKING SYSTEM    ");
        System.out.println("==========================================");

        /*REGISTER PARCELS*/
        Parcel p1 = new Parcel("P001", "Victor", "James", "Nairobi", 2.5, "High");
        Parcel p2 = new Parcel("P002", "Alice", "Brian", "Mombasa", 4.0, "Low");
        Parcel p3 = new Parcel("P003", "Kevin", "Sarah", "Kisumu", 1.8, "Medium");
        Parcel p4 = new Parcel("P004", "Mary", "John", "Nakuru", 6.2, "High");
        
        manager.registerParcel(p1);
        manager.registerParcel(p2);
        manager.registerParcel(p3);
        manager.registerParcel(p4);

        /*DISPLAY ALL PARCELS*/
        System.out.println("\nALL REGISTERED PARCELS");
        manager.displayAllParcels();
        
        /*HASHMAP SEARCH*/
        System.out.println("\nSEARCH USING HASHMAP");
        Parcel found = manager.searchParcel("P003");
        if(found != null){
            found.displayParcel();
        }
        else{
            System.out.println("Parcel not found.");
        }

        /*UPDATE STATUS*/
        System.out.println("\nUPDATING PARCEL STATUS...");
        manager.updateParcelStatus("P003", "Collected");
        manager.updateParcelStatus("P003", "Sorting Hub");
        manager.updateParcelStatus("P003", "In Transit");
        manager.updateParcelStatus("P003", "Delivered");
        
        /*DISPLAY TRACKING HISTORY*/
        System.out.println("\nTRACKING HISTORY");
        found.displayTrackingHistory();
        
        /*QUICKSORT*/
        System.out.println("\nPARCELS SORTED BY PRIORITY");
        manager.sortParcelsByPriority();
        
        /*BINARY SEARCH*/
        System.out.println("\nBINARY SEARCH");
        Parcel binaryResult = manager.binarySearchParcel("P002");
        if(binaryResult != null){
            binaryResult.displayParcel();
        }
        else{
            System.out.println("Parcel not found.");
        }
        
        /*DISPATCH QUEUE*/
        System.out.println("\nCURRENT DISPATCH QUEUE");
        manager.displayDispatchQueue();
        
        /*DISPATCH NEXT PARCEL*/
        System.out.println("\nDISPATCHING NEXT PARCEL...");
        Parcel dispatched = manager.dispatchNextParcel();
        if(dispatched != null){
            System.out.println();
            System.out.println(dispatched.getParcelID() + " dispatched successfully.");
        }
        
        /*DISPLAY QUEUE AGAIN*/
        System.out.println("\nUPDATED DISPATCH QUEUE");
        manager.displayDispatchQueue();
        
        /*DELETE PARCEL */
        System.out.println("\nDELETING P002");
        manager.deleteParcel("P002");
        
        /*DISPLAY REMAINING PARCELS*/
        System.out.println("\nPARCELS AFTER DELETION");
        manager.displayAllParcels();

        /*TOTAL PARCELS*/
        System.out.println();
        System.out.println("Total Parcels : " + manager.totalParcels());
        System.out.println();
        System.out.println("==========================================");
        System.out.println("            END OF DEMONSTRATION          ");
        System.out.println("==========================================");

        //  NEW: START API SERVER FOR HTML FRONTEND
        try {
            // Start server on port 8080
            HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
            System.out.println("\n[SERVER] Starting backend API server...");

            // 1. ENDPOINT: TRACK PARCEL
            server.createContext("/api/track", new HttpHandler() {
                @Override
                public void handle(HttpExchange exchange) throws IOException {
                    exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                    exchange.getResponseHeaders().set("Content-Type", "application/json");

                    String query = exchange.getRequestURI().getQuery();
                    String parcelId = "";
                    if (query != null && query.contains("id=")) {
                        parcelId = query.split("id=")[1].trim();
                    }

                    String jsonResponse;
                    Parcel requestedParcel = manager.searchParcel(parcelId);

                    if (requestedParcel != null) {
                        jsonResponse = convertParcelToJson(requestedParcel);
                        exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);
                    } else {
                        jsonResponse = "{\"error\": \"Parcel not found\"}";
                        exchange.sendResponseHeaders(404, jsonResponse.getBytes().length);
                    }

                    OutputStream os = exchange.getResponseBody();
                    os.write(jsonResponse.getBytes());
                    os.close();
                }
            });

            // 2. ENDPOINT: DISPATCH PARCEL
            server.createContext("/api/dispatch", new HttpHandler() {
                @Override
                public void handle(HttpExchange exchange) throws IOException {
                    exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                    exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

                    exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
                    // Handle preflight requests from the browser
                    if ("OPTIONS".equals(exchange.getRequestMethod())) {
                        exchange.sendResponseHeaders(204, -1);
                        return;
                    }

                    // Trigger the backend queue dequeue logic
                    Parcel dispatchedParcel = manager.dispatchNextParcel();
                    String jsonResponse;
                    int statusCode;

                    if (dispatchedParcel != null) {
                        jsonResponse = "{\"status\":\"success\", \"parcelId\":\"" + dispatchedParcel.getParcelID() + "\"}";
                        statusCode = 200;
                    } else {
                        jsonResponse = "{\"status\":\"error\", \"message\":\"Queue is empty\"}";
                        statusCode = 400;
                    }

                    exchange.sendResponseHeaders(statusCode, jsonResponse.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(jsonResponse.getBytes());
                    os.close();
                }
            });

            // 3. ENDPOINT: SORT PARCELS
            server.createContext("/api/sort", new HttpHandler() {
                @Override
                public void handle(HttpExchange exchange) throws IOException {
                    exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                    exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                    // Trigger the backend Quicksort logic

                    exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
                    manager.sortParcelsByPriority();
                    
                    // Respond to the frontend
                    String jsonResponse = "{\"status\":\"success\", \"message\":\"Backend successfully executed Quicksort!\"}";
                    
                    exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(jsonResponse.getBytes());
                    os.close();
                }
            });

            server.start();
            System.out.println("[SERVER] Java API live at: http://127.0.0.1:8080/api/track?id=P001");
            System.out.println("[SERVER] Ready for frontend fetch requests!");

        } catch (IOException e) {
            System.err.println("[SERVER] Failed to start server: " + e.getMessage());
        }
    }

    /**
     * Helper method to manually format a Parcel into valid JSON format.
     * (Avoids needing a third-party dependency like Jackson or Gson)
     */
    private static String convertParcelToJson(Parcel parcel) {
        return "{" +
                "\"parcelID\":\"" + parcel.getParcelID() + "\"," +
                "\"sender\":\"" + parcel.getSender() + "\"," +
                "\"receiver\":\"" + parcel.getReceiver() + "\"," +
                "\"destination\":\"" + parcel.getDestination() + "\"," +
                "\"weight\":" + parcel.getWeight() + "," +
                "\"priority\":\"" + parcel.getPriority() + "\"" +
                "}";
    }
}