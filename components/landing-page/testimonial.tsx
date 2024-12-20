import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'; // Adjust the import path as needed

// Import your PNG asset (convert SVG to PNG)
const david = require('@/assets/landing/david.png'); // Use PNG instead of SVG

const testimonials = [
    {
        text: "I used to pay thousands of dollars a month in rake, now I pay a $10 membership fee!",
        author: "David Aaron",
        image: david,
    },
    {
        text: "I used to pay thousands of dollars a month in rake, now I pay a $10 membership fee!",
        author: "David Aaron",
        image: david,
    },
    {
        text: "I used to pay thousands of dollars a month in rake, now I pay a $10 membership fee!",
        author: "David Aaron",
        image: david,
    },
    {
        text: "I used to pay thousands of dollars a month in rake, now I pay a $10 membership fee!",
        author: "David Aaron",
        image: david,
    },
    {
        text: "I used to pay thousands of dollars a month in rake, now I pay a $10 membership fee!",
        author: "David Aaron",
        image: david,
    },
];

const { width } = Dimensions.get('window');

const Testimonial = () => {
    return (
        <View style={styles.section}>
            <Text style={styles.title}>Testimonials</Text>
            <Carousel>
                <CarouselContent>
                    {testimonials.map((testimonial, index) => (
                        <CarouselItem key={index} style={styles.card}>
                            <Text style={styles.text}>&quot;{testimonial.text}&quot;</Text>
                            <View style={styles.authorContainer}>
                                <Image source={testimonial.image} style={styles.image} />
                                <Text style={styles.author}>{testimonial.author}</Text>
                            </View>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious style={styles.button} onPress={function (): void {
                    throw new Error('Function not implemented.');
                } } disabled={false} iconSource={undefined} />
                <CarouselNext style={styles.button} onPress={function (): void {
                    throw new Error('Function not implemented.');
                } } disabled={false} iconSource={undefined} />
            </Carousel>
            
            {/* <View style={{marginTop: 16, display: 'flex', justifyContent: 'center'}}
            className="mt-4 flex justify-center sm:hidden">
            <button
                className="mx-2 rounded-full bg-[#1e84f0] p-2"
                aria-label="Previous testimonial"
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                />
                </svg>
            </button>
            <button
                className="mx-2 rounded-full bg-[#1e84f0] p-2"
                aria-label="Next testimonial"
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                />
                </svg>
            </button>
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#11141d',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    title: {
        marginBottom: 16,
        textAlign: 'center',
        fontSize: 32,
        fontWeight: '800',
        color: '#1e84f0',
    },
    card: {
        flex: 1,
        justifyContent: 'space-between',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#21242f',
        backgroundColor: '#151924',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    text: {
        marginBottom: 8,
        fontSize: 14,
        color: '#ffffffb2',
        lineHeight: 20,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    image: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    author: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
    },
    button: {
        backgroundColor: '#1e84f0',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 10,
    },
});

export default Testimonial;
