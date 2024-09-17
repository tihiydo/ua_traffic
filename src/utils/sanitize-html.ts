import { decode } from 'he';


export function sanitizeHTML(htmlContent: string, allowedTags: string[]): string {
    // Create a temporary div element to hold the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // Function to sanitize the HTML recursively
    const sanitizeElement = (element: HTMLElement) => {
        // Iterate through child nodes
        for (let i = element.children.length - 1; i >= 0; i--) {
            const child = element.children[i] as HTMLElement;
            // Recursively sanitize child nodes
            sanitizeElement(child);
            // Remove element if it's not in the allowed tags list
            if (!allowedTags.includes(child.tagName.toLowerCase())) {
                while (child.firstChild) {
                    // Move child nodes to the parent before removing the child
                    element.insertBefore(child.firstChild, child);
                }
                // Remove the empty element
                element.removeChild(child);
            }
        }
    };

    // Start sanitizing from the root element
    sanitizeElement(tempDiv);

    // Decode HTML entities
    const sanitizedHTML = decode(tempDiv.innerHTML);

    // Return the sanitized HTML content
    return sanitizedHTML;
}