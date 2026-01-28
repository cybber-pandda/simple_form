@component('mail::message')
{{-- Logo Section --}}
<center>
    <a href="{{ config('app.url') }}" style="display: inline-block;">
        <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('assets/logo/FormCrafter.png'))) }}" 
     alt="FormCrafter" 
     style="width: 100px; height: auto;">
    </a>
</center>

# Hello, {{ $user->name }}!

Welcome to the **FormCrafter** family. An administrator has created an account for you with the following credentials:

@component('mail::panel')
**Email Address:** `{{ $user->email }}`  
**Temporary Password:** `{{ $password }}`
@endcomponent

{{-- Button Section --}}
<center>
@component('mail::button', ['url' => config('app.url') . '/login', 'color' => 'primary'])
Access Your Dashboard
@endcomponent
</center>

---

### Next Steps:
1. **Log in:** Click the button above to access your account.
2. **Secure Account:** Go to your **Profile Settings** and update your temporary password immediately.

*If you didn't expect this email, please ignore it or contact your system administrator.*

Best regards,<br>
**The {{ config('app.name') }} Team**
@endcomponent