#print ("hello world") 
# This prints some texts
#print("what's up")

#red_bucket = "Kelvin"
#del red_bucket
#print (red_bucket)

#red_bucket = input("What do you want to put in the bucket? ")
#print (red_bucket)

#print (5<=4)

Thomas_Age = 5
Age_at_Kindergarten = 5
#print(Thomas_Age == Age_at_Kindergarten)

if Thomas_Age < Age_at_Kindergarten:
    print("Thomas should be in pre-school")
elif  Thomas_Age == Age_at_Kindergarten:
     print("Enjoy kindergarten")
else:
    print("Thomas should be in kindergarten or another class")

#print("Temitayo is a good girl")
#print("Temitayo is a good girl")
#print("Temitayo is a good girl")  

def print_temi():
    text = "Temibillions is a good girl"
    print(text)
    print(text)
    print(text)
    print(text)

print_temi()   

def school_age_calculator(age,name):
    if age < 5:
        print("Enjoy the time!", name, "is only", age)
    elif age == 5:
        print("Enjoy kindergarten", name)
    else:
        print("They grow up so fast")   

school_age_calculator(5, "Thomas")           


#def add_ten_to_age(age):
    #new_age = age + 10
    #return new_age

#How_old_will_I_be = add_ten_to_age(3)
#print(How_old_will_I_be)

#while
x=0
while (x<5):
    print(x)
    x=x+1

#For
for x in range (7,10):
    print(x)

days=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]  

for d in days:
    if(d=="Thu"):continue
    print(d)

import math    
print("pi is", math.pi)