import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ViewStyle, TextStyle } from 'react-native';
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';

interface CarouselContextProps {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

interface CarouselProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

const Carousel = React.forwardRef<View, CarouselProps>(({ children, style, ...props }, ref) => {
  const [carouselRef, api] = useEmblaCarousel();
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <CarouselContext.Provider value={{ carouselRef, api, scrollPrev: api?.scrollPrev, scrollNext: api?.scrollNext, canScrollPrev, canScrollNext }}>
      <View ref={ref} style={[styles.carousel, style]} {...props}>
        <ScrollView horizontal ref={carouselRef} showsHorizontalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    </CarouselContext.Provider>
  );
});
Carousel.displayName = "Carousel";

interface CarouselContentProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

const CarouselContent = React.forwardRef<View, CarouselContentProps>(({ style, children }, ref) => {
  
  // const { carouselRef, orientation } = useCarousel();
  return (
    <View style={{overflow: 'hidden'}}>
      <View ref={ref} style={[styles.CarouselContent, style]}>
        {children}
      </View>
    </View>
  );
});
CarouselContent.displayName = "CarouselContent";


interface CarouselItemProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

const CarouselItem = React.forwardRef<View, CarouselItemProps>(({ style, children }, ref) => {
  return (
    <View ref={ref} style={[styles.carouselItem, style]}>
      {children}
    </View>
  );
});
CarouselItem.displayName = "CarouselItem";

interface CarouselButtonProps {
  onPress: () => void;
  disabled: boolean;
  iconSource: any; // Adjust type as needed for your image source
  style?: ViewStyle;
}

const CarouselButton: React.FC<CarouselButtonProps> = ({ onPress, disabled, iconSource, style }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.carouselButton, style]}>
      <Image source={iconSource} style={styles.icon} />
      <Text style={styles.buttonText}>{disabled ? '' : 'Slide'}</Text>
    </TouchableOpacity>
  );
};

const CarouselPrevious = React.forwardRef<TouchableOpacity, React.ComponentProps<typeof CarouselButton>>((props, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
      <CarouselButton
        ref={ref}
        onPress={scrollPrev}
        disabled={!canScrollPrev}
        iconSource={require('@/assets/landing/leftArrow.png')} // Adjust the path
        style={styles.prevButton}
      />
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<TouchableOpacity, React.ComponentProps<typeof CarouselButton>>((props, ref) => {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
      <CarouselButton
        ref={ref}
        onPress={scrollNext}
        disabled={!canScrollNext}
        iconSource={require('@/assets/landing/rightArrow.png')} // Adjust the path
        style={styles.nextButton}
      />
  );
});
CarouselNext.displayName = "CarouselNext";

const styles = StyleSheet.create({
  carousel: {
    position: 'relative',
  },
  CarouselContent: {
    display: 'flex',
  },
  carouselItem: {
    minWidth: 300, // Adjust as needed
    marginHorizontal: 10,
  },
  carouselButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -50 }],
    zIndex: 1,
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  buttonText: {
    display: 'none', // Hide text, show only icon
  },
});

export {
  Carousel,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselContent
};
