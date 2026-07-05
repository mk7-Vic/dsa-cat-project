package datastructures;

import java.util.ArrayList;
import model.Parcel;

public class ParcelHashTable {

    // Node for separate chaining
    private static class HashNode {

        private String key;

        private Parcel value;

        private HashNode next;

        public HashNode(String key, Parcel value){

            this.key = key;
            this.value = value;
            this.next = null;

        }

    }

    // Size of hash table
    private static final int CAPACITY = 20;

    // Array of buckets
    private HashNode[] table;

    // Number of parcels
    private int size;

    // Constructor
    public ParcelHashTable(){

        table = new HashNode[CAPACITY];

        size = 0;

    }

    // Hash Function
    private int hash(String key){

        return Math.abs(key.hashCode()) % CAPACITY;

    }

    // Insert Parcel
    public boolean put(String key, Parcel value){

        int index = hash(key);

        HashNode current = table[index];

        while(current != null){

            if(current.key.equals(key)){

                return false;

            }

            current = current.next;

        }

        HashNode newNode = new HashNode(key,value);

        newNode.next = table[index];

        table[index] = newNode;

        size++;

        return true;

    }

    // Retrieve Parcel
    public Parcel get(String key){

        int index = hash(key);

        HashNode current = table[index];

        while(current != null){

            if(current.key.equals(key)){

                return current.value;

            }

            current = current.next;

        }

        return null;

    }

    // Check if key exists
    public boolean containsKey(String key){

        return get(key) != null;

    }

    // Remove Parcel
    public boolean remove(String key){

        int index = hash(key);

        HashNode current = table[index];

        HashNode previous = null;

        while(current != null){

            if(current.key.equals(key)){

                if(previous == null){

                    table[index] = current.next;

                }

                else{

                    previous.next = current.next;

                }

                size--;

                return true;

            }

            previous = current;

            current = current.next;

        }

        return false;

    }

    // Number of parcels
    public int size(){

        return size;

    }

    // Return all parcels
    public ArrayList<Parcel> getAllParcels(){

        ArrayList<Parcel> parcels = new ArrayList<>();

        for(int i = 0; i < CAPACITY; i++){

            HashNode current = table[i];

            while(current != null){

                parcels.add(current.value);

                current = current.next;

            }

        }

        return parcels;

    }

    // Display hash table
    public void display(){

        for(int i = 0; i < CAPACITY; i++){

            System.out.print("Bucket " + i + " : ");

            HashNode current = table[i];

            while(current != null){

                System.out.print(current.key + " -> ");

                current = current.next;

            }

            System.out.println("null");

        }

    }

}