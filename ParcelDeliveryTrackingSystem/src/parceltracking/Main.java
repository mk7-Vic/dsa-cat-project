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
        Parcel p1 = new Parcel("P001", "Victor", "Norah", "Nairobi", 2.5, "High");
        Parcel p2 = new Parcel("P002", "Precious", "Deborah", "Mombasa", 4.0, "Low");
        Parcel p3 = new Parcel("P003", "Obare", "Alvin", "Kisumu", 1.8, "Medium");
        Parcel p4 = new Parcel("P004", "Salome", "Neri", "Nakuru", 6.2, "High");
        
        manager.registerParcel(p1);
        manager.registerParcel(p2);
        manager.registerParcel(p3);
        manager.registerParcel(p4);

        
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
                    exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

                    // Handle Preflight check
                    if ("OPTIONS".equals(exchange.getRequestMethod())) {
                        exchange.sendResponseHeaders(204, -1);
                        return;
                    }

                    // 1. TRIGGER YOUR CUSTOM QUICKSORT.JAVA ALGORITHM
                    // This calls manager -> which calls QuickSort.sortByPriority()
                    java.util.ArrayList<Parcel> sortedList = manager.sortParcelsByPriority();
                    
                    // 2. Convert the newly sorted Java list into JSON format
                    StringBuilder jsonBuilder = new StringBuilder("[");
                    for (int i = 0; i < sortedList.size(); i++) {
                        jsonBuilder.append(convertParcelToJson(sortedList.get(i)));
                        if (i < sortedList.size() - 1) {
                            jsonBuilder.append(",");
                        }
                    }
                    jsonBuilder.append("]");

                    String jsonResponse = jsonBuilder.toString();
                    
                    // 3. Send the fully sorted data back to the browser
                    exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(jsonResponse.getBytes());
                    os.close();
                }
            });

            // 4. ENDPOINT: REGISTER NEW PARCEL
            server.createContext("/api/register", new HttpHandler() {
                @Override
                public void handle(HttpExchange exchange) throws IOException {
                    exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                    exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "POST, OPTIONS");
                    exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

                    if ("OPTIONS".equals(exchange.getRequestMethod())) {
                        exchange.sendResponseHeaders(204, -1);
                        return;
                    }

                    // Read the incoming JSON from JavaScript
                    java.util.Scanner scanner = new java.util.Scanner(exchange.getRequestBody()).useDelimiter("\\A");
                    String requestBody = scanner.hasNext() ? scanner.next() : "";
                    
                    // Manually extract the values (since we aren't using external JSON libraries)
                    String id = extractJsonValue(requestBody, "parcelID");
                    String sender = extractJsonValue(requestBody, "sender");
                    String receiver = extractJsonValue(requestBody, "receiver");
                    String destination = extractJsonValue(requestBody, "destination");
                    String priority = extractJsonValue(requestBody, "priority");
                    double weight = Double.parseDouble(extractJsonValue(requestBody, "weight"));

                    // Create and register the parcel in the backend
                    Parcel newParcel = new Parcel(id, sender, receiver, destination, weight, priority);
                    boolean success = manager.registerParcel(newParcel);

                    String jsonResponse;
                    if (success) {
                        jsonResponse = "{\"status\":\"success\"}";
                        exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);
                    } else {
                        jsonResponse = "{\"status\":\"error\", \"message\":\"ID exists\"}";
                        exchange.sendResponseHeaders(400, jsonResponse.getBytes().length);
                    }

                    OutputStream os = exchange.getResponseBody();
                    os.write(jsonResponse.getBytes());
                    os.close();
                }
            });
            // 5. ENDPOINT: GET ALL PARCELS
            server.createContext("/api/parcels", new HttpHandler() {
                @Override
                public void handle(HttpExchange exchange) throws IOException {
                    exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                    exchange.getResponseHeaders().set("Content-Type", "application/json");

                    // Get all parcels from your ParcelManager
                    java.util.ArrayList<Parcel> allParcels = manager.getAllParcels();
                    
                    // ---> NEW: Use your custom Java algorithm to sort by ID! <---
                    algorithms.Search.sortByParcelID(allParcels);
                    
                    // Manually build a JSON Array string
                    StringBuilder jsonBuilder = new StringBuilder("[");
                    for (int i = 0; i < allParcels.size(); i++) {
                        jsonBuilder.append(convertParcelToJson(allParcels.get(i)));
                        if (i < allParcels.size() - 1) {
                            jsonBuilder.append(",");
                        }
                    }
                    jsonBuilder.append("]");

                    String jsonResponse = jsonBuilder.toString();
                    
                    exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(jsonResponse.getBytes());
                    os.close();
                }
            });
            // 6. ENDPOINT: DELETE PARCEL (CRUD Requirement)
            server.createContext("/api/delete", new HttpHandler() {
                @Override
                public void handle(HttpExchange exchange) throws IOException {
                    exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                    exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "DELETE, OPTIONS");
                    
                    if ("OPTIONS".equals(exchange.getRequestMethod())) {
                        exchange.sendResponseHeaders(204, -1);
                        return;
                    }

                    // Extract ID from the URL (e.g., /api/delete?id=P001)
                    String query = exchange.getRequestURI().getQuery();
                    String parcelId = "";
                    if (query != null && query.contains("id=")) {
                        parcelId = query.split("id=")[1].trim();
                    }

                    // Delete from Hash Map
                    boolean removed = manager.deleteParcel(parcelId);
                    
                    String jsonResponse;
                    if (removed) {
                        jsonResponse = "{\"status\":\"success\"}";
                        exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);
                    } else {
                        jsonResponse = "{\"status\":\"error\", \"message\":\"Not found\"}";
                        exchange.sendResponseHeaders(404, jsonResponse.getBytes().length);
                    }
                    
                    OutputStream os = exchange.getResponseBody();
                    os.write(jsonResponse.getBytes());
                    os.close();
                }
            });

            // 7. ENDPOINT: MARK PARCEL AS DELIVERED
            server.createContext("/api/deliver", new HttpHandler() {
                @Override
                public void handle(HttpExchange exchange) throws IOException {
                    exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                    exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "PUT, OPTIONS");
                    
                    if ("OPTIONS".equals(exchange.getRequestMethod())) {
                        exchange.sendResponseHeaders(204, -1);
                        return;
                    }

                    // Extract ID from the URL (e.g., /api/deliver?id=P001)
                    String query = exchange.getRequestURI().getQuery();
                    String parcelId = "";
                    if (query != null && query.contains("id=")) {
                        parcelId = query.split("id=")[1].trim();
                    }

                    Parcel parcel = manager.searchParcel(parcelId);
                    String jsonResponse;
                    int statusCode;

                    if (parcel != null) {
                        if (parcel.getStatus().equalsIgnoreCase("Delivered")) {
                            jsonResponse = "{\"status\":\"error\", \"message\":\"Parcel is already delivered!\"}";
                            statusCode = 400; // Bad Request
                        } else {
                            manager.updateParcelStatus(parcelId, "Delivered");
                            jsonResponse = "{\"status\":\"success\"}";
                            statusCode = 200; // OK
                        }
                    } else {
                        jsonResponse = "{\"status\":\"error\", \"message\":\"Parcel not found\"}";
                        statusCode = 404; // Not Found
                    }
                    
                    exchange.sendResponseHeaders(statusCode, jsonResponse.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(jsonResponse.getBytes());
                    os.close();
                }
            });

            server.setExecutor(null);
            server.start();
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
                "\"priority\":\"" + parcel.getPriority() + "\"," + 
                "\"status\":\"" + parcel.getStatus() + "\"" + // Added status here!
                "}";
    }

    /*Helper method to extract values from a simple JSON string without dependencies.*/
    private static String extractJsonValue(String json, String key) {
        String searchKey = "\"" + key + "\":\"";
        int startIndex = json.indexOf(searchKey);
        if (startIndex == -1) {
            // Check for unquoted numbers
            searchKey = "\"" + key + "\":";
            startIndex = json.indexOf(searchKey);
            if(startIndex == -1) return "";
            int endIndex = json.indexOf(",", startIndex + searchKey.length());
            if(endIndex == -1) endIndex = json.indexOf("}", startIndex + searchKey.length());
            return json.substring(startIndex + searchKey.length(), endIndex).trim();
        }
        int endIndex = json.indexOf("\"", startIndex + searchKey.length());
        return json.substring(startIndex + searchKey.length(), endIndex);
    }
}