package datastructures;

import java.util.LinkedList;
import java.util.Queue;

import model.Parcel;

public class ParcelQueue {

    // Queue to store parcels waiting for dispatch
    private Queue<Parcel> queue;

    // Constructor
    public ParcelQueue() {

        queue = new LinkedList<>();

    }

    // Add parcel to the rear of the queue
    public void enqueue(Parcel parcel) {

        queue.offer(parcel);

    }

    // Remove parcel from the front of the queue
    public Parcel dequeue() {

        if(queue.isEmpty()){

            System.out.println("Dispatch queue is empty.");

            return null;

        }

        return queue.poll();

    }

    // View the first parcel without removing it
    public Parcel peek() {

        if(queue.isEmpty()){

            return null;

        }

        return queue.peek();

    }

    // Check if queue is empty
    public boolean isEmpty() {

        return queue.isEmpty();

    }

    // Number of parcels in queue
    public int size() {

        return queue.size();

    }

    // Display all parcels waiting for dispatch
    public void displayQueue() {

        if(queue.isEmpty()){

            System.out.println("No parcels waiting for dispatch.");

            return;

        }

        System.out.println("\nDispatch Queue");

        System.out.println("--------------------------------------------------------------");

        for(Parcel parcel : queue){

            System.out.println(parcel);

        }

    }

}