'use client';

import * as React from 'react';
import Link from 'next/link';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {cn} from "@/lib/utils";
import {ModeToggle} from "@/components/ui/mode-toggle";

const blockchainItems: { title: string; href: string; description: string }[] = [
    {title: 'Blocks', href: '/blocks', description: 'View all blocks'},
    {title: 'Epochs', href: '/epochs', description: 'View all epochs'},
    {title: 'Transactions', href: '/transactions', description: 'View all transactions'},
    {title: 'Native Tokens', href: '/native-tokens', description: 'View all native tokens'},
    {title: 'Smart Contracts', href: '/smart-contracts', description: 'View all smart contracts'},
    {title: 'Pools', href: '/pools', description: 'View all pools'},
    {title: 'Holders', href: '/holders', description: 'View all holders'},
];

export function NavigationBar() {
    return (
        <div className="flex justify-center py-4">
            <NavigationMenu orientation={"horizontal"}>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/public" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/dashboard" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Dashboard</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/graph" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Visualizer</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Blockchain</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-1">
                                {blockchainItems.map((item) => (
                                    <ListItem key={item.title} title={item.title} href={item.href}>
                                        {item.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <ModeToggle/>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'>
>(({className, title, children, ...props}, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        'blocks select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = 'ListItem';